import { useEffect, useState } from 'react';

enum Tab {
    Raw,
    Decoded
};

export interface ECViewerProps {
    raw: string;
    decoded: {[key:string]: string};
};

export const ECViewer = ({raw, decoded}: ECViewerProps) => {
    const decodedStr = JSON.stringify(decoded, null, 4);
    const [tab, setTab] = useState(Tab.Raw);

    const handleTabChange = (tab: Tab) => {
        const unselected = document.getElementById(tab === Tab.Raw ? "dec" : "raw") as HTMLInputElement;
        unselected.checked = false;

        const selected = document.getElementById(tab === Tab.Raw ? "raw" : "dec") as HTMLInputElement;
        selected.checked = true;

        setTab(tab);
    }

    useEffect(() => handleTabChange(Tab.Raw), []);

    return (
        <div className="container">
            <div className="row">
                <div className="col-6">
                    <div className="form-check">
                        <input name="Raw" type="radio" id="raw" onClick={() => handleTabChange(Tab.Raw)} />
                        <label htmlFor="raw">Raw</label>
                    </div>
                </div>
                <div className="col-6">
                    <div className="form-check">
                        <input name="Decoded" type="radio" id="dec" onClick={() => handleTabChange(Tab.Decoded)}/>
                        <label htmlFor="dec">Decoded</label>
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