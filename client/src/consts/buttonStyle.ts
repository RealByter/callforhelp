import { defaultTextColor } from './colors';


export const buttonStyle = {
    backgroundColor: "white",
    width: "100%",
    color: defaultTextColor,
    borderRadius: "140px",
    fontSize: "14px",
    outline: "none",
    "&:focus": {
        backgroundColor: "white",
        width: "100%",
        color: defaultTextColor,
        borderRadius: "140px",
        fontSize: "14px",
        outline: "none"
    }
}