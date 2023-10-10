(comment) @comment
(number) @number
(bool) @boolean

(string) @string
; (escape_sequence) @punctuation.special
; (interpolation) @punctuation.special

; (namespace) @namespace

(function_definition
	name: (identifier) @function
) 

(function_definition 
	param: (identifier) @parameter
)

(function_call) @function.call

(property_expression
	property: (identifier) @field 
)

(macro_identifier) @function.macro

;(property_expression
;	method: (identifier) @method.call 
;)

(static_expression
	namespace: (identifier) @namespace
)

;(static_expression
;	namespace: (identifier) @namespace
;)

(variable) @variable 

(type) @type

(import
	import_single: (identifier) @namespace
)

(import_module 
	object: (identifier) @symbol
)

(import_module 
	namespace: (identifier) @namespace
)

[
	"true"
	"false" 
] @bool

[
 "as"
; "void"
 "ref"
 "deref"
 "let"
 "mut"
 "in"
 "export"
] @keyword

[
 "import"
] @include 

[
 "if"
 "else"
 "unless"
 "then"
] @conditional

[
 "until"
 "while"
 "for"
] @repeat

[
 "fun"
] @keyword.function

[
 "return"
] @keyword.return

[
 "("
 ")"
 "{"
 "}"
 "["
 "]"
] @punctuation.bracket

[
 ","
] @operator

[
	"%="
	"^="
	"&="
	"*="
	"-="
	"+="
	"|="
	"/="
	"="
	"||"
	"&&"
	"^"
	"&"
	"=="
	"!="
	"<"
	">"
	"<="
	">="
	">>"
	"<<"
	"+"
	"-"
	"*"
	"/"
	"%"
	"!"
	"::"
] @operator

[
	"i32"
	"i64"
	"f32"
	"f64"
	"u32"
	"u64"
	"usize"
	"str"
	"char"
	"bool"
 ] @type
