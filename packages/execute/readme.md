# @evaluate/execute

This package exports a handful of functions related to execution and language fetching all from the Piston API. Primarily it exports `executeCode`, which along with others takes a language and source code and executes it. That language has to be a `Language` object, which can be fetched using any of the language fetching functions. Additionally, there is also some language constants, containing information that Piston does not provide.
