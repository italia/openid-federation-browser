import { useEffect, useState } from "react";
import { useSearchParams } from 'react-router-dom';
import { InputAtom } from "../atoms/Input";
import { isValidUrl } from "../lib/utils";
import { TrstAnchorListAtom } from "../atoms/TrustAnchorList";

export function SideMenu() {

    const [searchParams, setSearchParams] = useSearchParams();
    const [urlInputVisible, setUrlInputVisible] = useState(false);
    const [listVisible, setListVisible] = useState(false);

    const handleUrlInputElmVisibility = () => {
        setUrlInputVisible(!urlInputVisible);

        if (listVisible) setListVisible(false);
    };

    const handleListElmVisibility = () => {
        setListVisible(!listVisible);

        if (urlInputVisible) setUrlInputVisible(false);
    };

    useEffect(() => {
        if (searchParams.has("trustAnchorUrl")) {
            setUrlInputVisible(false);
            setListVisible(false);
        }
    }, [searchParams]);

    return (
        <div className="sidebar-wrapper">
            <div className="sidebar-linklist-wrapper">
                <div className="container">
                    <div className="row">
                        <div className="col-12 nav-item">
                            <div className="nav nav-tabs nav-tabs-vertical nav-tabs-vertical-background" id="nav-vertical-tab-bg" role="tablist" aria-orientation="vertical">
                                <a className="nav-link" id="nav-vertical-tab-bg1-tab" data-bs-toggle="tab" href="#nav-vertical-tab-bg1" role="tab" aria-controls="nav-vertical-tab-bg1" aria-selected="true" onClick={handleUrlInputElmVisibility}>Insert Trust Anchor Url</a>
                                <InputAtom validationFn={isValidUrl} inputLabel="Url: " invalidMessageId="invalid_url_error_message" isVisible={urlInputVisible} />
                            </div>
                            <div className="nav nav-tabs nav-tabs-vertical nav-tabs-vertical-background" id="nav-vertical-tab-bg" role="tablist" aria-orientation="vertical">
                                <a className="nav-link" id="nav-vertical-tab-bg2-tab" data-bs-toggle="tab" href="#nav-vertical-tab-bg2" role="tab" aria-controls="nav-vertical-tab-bg2" aria-selected="false" onClick={handleListElmVisibility}>Select From a List</a>
                                <TrstAnchorListAtom isVisible={listVisible} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}