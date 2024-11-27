import { SlimHeader } from "../atoms/SlimHeader";
import { NavBarAtom } from "../atoms/NavBar";

export const Header = () => {
    return (
        <div style={{width: "100%"}}>
            <div className="row"><SlimHeader /></div>
            <div className="row"><NavBarAtom /></div>
        </div>
    );
};