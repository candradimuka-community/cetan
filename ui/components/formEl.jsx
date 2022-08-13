const FormEl = ({
    type = "text",
    id = "form",
    placeholder = "type your ...",
    onChange = null,
    value = null,
    error = false,
    disabled = false,
    readonly = false,
    errorMessage = "",
    onKeyDown=null
}) => {
    return (
        <>
            <input 
                type={type} 
                id={id} 
                className={`${error ? 'outline-red-500 border-red-500 border-2' :'focus:outline-blue-500'} w-full mt-5 py-2 px-5 rounded-full`} 
                placeholder={placeholder} 
                disabled={disabled}
                onChange={onChange}
                value={value}
                readOnly={readonly}
                onKeyDown={onKeyDown}
                />
            {error && (
                <p className="text-red-500 text-sm ml-5">{errorMessage}</p>
            )}
        </>
    )
}
export default FormEl