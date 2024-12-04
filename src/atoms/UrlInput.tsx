import { useEffect, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { useSearchParams } from 'react-router-dom';
import { handleCollapseVisibility, cleanInput } from '../lib/utils';

interface InputProps {
    validationFn: (value: string) => boolean;
};

export const UrlInputAtom = ({validationFn}: InputProps) => {
    const [inputValue, setInputValue] = useState('');
    const [doCheck, setDoCheck] = useState(false);
    const [searchParams, setSearchParams] = useSearchParams();

    const changeValue = (e: any) => setInputValue(e.target.value);

    useEffect(() => {
        if (!doCheck) return;
        if (validationFn(inputValue)) {
            setSearchParams({ 
                trustAnchorUrl: inputValue,
                discoveryType: searchParams.has("insertEntityUrl") ? "entity" : "anchor",
            });
            handleCollapseVisibility('invalid-input-collapse', false);
            cleanInput('input-value');
        }else{
            handleCollapseVisibility('invalid-input-collapse', true);
        }
        setDoCheck(false);
    }, [doCheck]);

    return (
        <div className='container'>
            <div className='row'>
                <h4><FormattedMessage id={searchParams.has("insertEntityUrl") ? "insert_entity_url_label" : "insert_anchor_url_label"} /></h4>
            </div>
            <div className="row">
                <input type="text" className="form-control" id="input-value" onChange={changeValue} />
            </div>
            <div className="collapse row" id="invalid-input-collapse">
                <div className="col-12">
                    <div className="alert alert-danger alert-dismissible fade show" role="alert">
                        <FormattedMessage id="invalid_url_error_message" />
                    </div>
                </div>
            </div>
            <button className="btn btn-primary mt-3" onClick={() => setDoCheck(true)}><FormattedMessage id="trust_anchor_url_button" /></button>
        </div>
    );
}