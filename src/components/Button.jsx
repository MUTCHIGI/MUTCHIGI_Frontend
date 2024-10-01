import './Button.css';

function Button({text,classname,onClick,logo}) {
    return <button onClick={onClick} className={`button_${classname}`}>
        {logo && <img src={logo} alt="Logo" className="button-logo" />}
        {text}
    </button>
}

export default Button;