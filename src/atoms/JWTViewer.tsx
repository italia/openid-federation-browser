import { useEffect, useState } from 'react';

enum Tab {
    Raw,
    Decoded
};

export interface ECViewerProps {
    id: string;
    raw: string;
    decoded: {[key:string]: string};
};

export const JWTViewer = ({id, raw, decoded}: ECViewerProps) => {
    const decodedStr = JSON.stringify(decoded, null, 4);
    const [tab, setTab] = useState(Tab.Raw);

    const handleTabChange = (tab: Tab) => {
        const unselected = document.getElementById(tab === Tab.Raw ? `${id}-dec` : `${id}-raw`) as HTMLInputElement;
        unselected.checked = false;

        const selected = document.getElementById(tab === Tab.Raw ? `${id}-raw` : `${id}-dec`) as HTMLInputElement;
        selected.checked = true;

        setTab(tab);
    }

    useEffect(() => handleTabChange(Tab.Raw), []);

    return (
        <div className="container" style={{width: "100%", padding: "14px 24px"}}>
            <div className="row">
                <div className="col-6">
                    <div className="form-check">
                        <input name="Raw" type="radio" id={`${id}-raw`} onClick={() => handleTabChange(Tab.Raw)} />
                        <label htmlFor={`${id}-raw`}>Raw</label>
                    </div>
                </div>
                <div className="col-6">
                    <div className="form-check">
                        <input name="Decoded" type="radio" id={`${id}-dec`} onClick={() => handleTabChange(Tab.Decoded)}/>
                        <label htmlFor={`${id}-dec`}>Decoded</label>
                    </div>
                </div>
            </div>
            <div className="row">
                <div className="col-12">
                    {
                        tab === Tab.Raw ? 
                            <textarea style={{overflowY: "scroll", resize: "none", width: "100%", height:"20rem"}} value={raw} readOnly></textarea> :
                            <textarea style={{overflowY: "scroll", resize: "none", width: "100%", height:"20rem"}} value={decodedStr} readOnly></textarea>
                    }
                </div>
            </div>
        </div>
    );
};