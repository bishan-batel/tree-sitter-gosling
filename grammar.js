module.exports = grammar({
  name: "gosling",
  extras: ($) => [/\s|\\\r?\n/, $.comment],
  inline: ($) => [$._expression, $._statement, $.bin_expr],
  word: ($) => $.identifier,

  rules: {
    source_file: ($) => repeat($._top_level),
    // source_file: ($) => repeat($.import),
    _top_level: ($) =>
      choice(
        $.import,
        seq(optional($.visibility), choice($.function_definition))
      ),

    import: ($) =>
      seq(
        "import",
        choice($.import_module, prec(10, field("import_single", $.identifier)))
      ),

    import_module: ($) =>
      choice(
        field("object", $.identifier),
        seq(field("namespace", $.identifier), ".", choice($.import_module, "*"))
      ),

    visibility: ($) => choice("export"),

    function_definition: ($) =>
      seq(
        "fun",
        field("name", $.identifier),
        "(",
        optional(commaSep(seq(field("param", $.identifier), ":", $.type))),
        ")",
        optional(seq(":", $.type)),
        $.function_scope
      ),

    _statement: ($) =>
      choice(
        $._expression,
        $.let_statement,
        $.conditional_statement,
        $.repeat_statement,
        $.for_statement,
        $.return_statement
      ),

    let_statement: ($) =>
      seq(
        "let",
        optional("mut"),
        $.variable,
        optional(seq(":", $.type)),
        optional(seq("=", $._expression))
      ),

    repeat_statement: ($) =>
      seq(choice("until", "while"), $._expression, $.function_scope),

    for_statement: ($) =>
      seq(
        "for",
        $.variable,
        optional(seq(":", $.type)),

        choice(
          seq("=", $._expression, ",", $._expression, ",", $._expression),
          seq("in", $._expression)
        ),
        $.function_scope
      ),

    conditional_statement: ($) =>
      seq(
        choice("if", "unless"),
        $._expression,

        choice(
          seq("then", $._statement),
          seq(
            $.function_scope,
            optional(
              seq("else", choice($.conditional_statement, $.function_scope))
            )
          )
        )
      ),

    return_statement: ($) => seq("return", choice("\n", $._expression)),

    function_scope: ($) => seq("{", repeat($._statement), "}"),

    _expression: ($) =>
      choice(
        $.variable,
        $.bool,
        $.number,
        $.string,
        $.binary_expression,
        $.unary_expression,
        $.paren_expression,
        $.function_call,
        $.macro_call,
        $.property_expression,
        $.static_expression
      ),

    paren_expression: ($) => seq("(", $._expression, ")"),

    property_expression: ($) =>
      prec(
        200,
        seq(
          $._expression,
          ".",
          choice(
            field("property", $.identifier),
            field("method", $.function_call)
          )
        )
      ),

    static_expression: ($) =>
      prec(
        204,
        seq(
          field("namespace", $.identifier),
          "::",
          choice(
            $.static_expression,
            $.function_call,
            field("property", $.variable)
          )
        )
      ),

    function_call: ($) =>
      prec(203, seq($.identifier, "(", commaSep($._expression), ")")),

    macro_call: ($) =>
      prec(203, seq($.macro_identifier, "(", commaSep($._expression), ")")),

    binary_expression: ($) =>
      choice(
        prec.left(
          1,
          seq(
            $._expression,
            choice("%=", "^=", "&=", "*=", "-=", "+=", "|=", "/=", "="),
            $._expression
          )
        ),
        prec.left(2, seq($._expression, "||", $._expression)),
        prec.left(3, seq($._expression, "&&", $._expression)),
        prec.left(4, seq($._expression, "|", $._expression)),
        prec.left(5, seq($._expression, "^", $._expression)),
        prec.left(6, seq($._expression, "&", $._expression)),
        prec.left(7, seq($._expression, choice("==", "!="), $._expression)),
        prec.left(
          8,
          seq($._expression, choice("<", "<=", ">", ">="), $._expression)
        ),
        prec.left(9, seq($._expression, choice(">>", "<<"), $._expression)),
        prec.left(10, seq($._expression, choice("+", "-"), $._expression)),
        prec.left(11, seq($._expression, choice("/", "*", "%"), $._expression)),
        prec.left(12, seq($._expression, "as", $.type))
      ),

    unary_expression: ($) =>
      prec.left(99, seq(choice("!", "-", "ref", "deref"), $._expression)),

    variable: ($) => $.identifier,

    type: ($) =>
      choice(
        prec.left(10, seq("ref", "[", $.type, "]")),
        prec.left(9, seq($.identifier, "<", commaSep1($.type), ">")),
        "i32",
        "i64",
        "f32",
        "f64",
        "u32",
        "u64",
        "usize",
        "bool",
        "str",
        "char",
        $.identifier
      ),

    identifier: ($) => /[A-Za-z_][A-Za-z0-9_]*/,
    macro_identifier: ($) => prec(300, /[A-Za-z_][A-Za-z0-9_]*!/),
    number: ($) => /[0-9]+\.?[0-9]*f?/,
    bool: ($) => prec(10, choice("true", "false")),
    string: ($) => seq('"', optional(token(/[^"]+/)), '"'),
    comment: (_) =>
      token(
        choice(
          seq("//", /(\\+(.|\r?\n)|[^\\\n])*/),
          seq("/*", /[^*]*\*+([^/*][^*]*\*+)*/, "/")
        )
      ),
  },
});

function sep(rule, separator) {
  return optional(sep1(rule, separator));
}

function sep1(rule, separator) {
  return seq(rule, repeat(seq(separator, rule)));
}

function commaSep1(rule) {
  return sep1(rule, ",");
}

function commaSep(rule) {
  return optional(commaSep1(rule));
}
