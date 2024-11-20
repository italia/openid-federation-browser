import { useEffect, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { useSearchParams } from 'react-router-dom';
import { getCollapsable, cleanInput, handleCollapseVisibility } from '../lib/utils';

interface InputProps {
    validationFn: (value: string) => boolean;
    inputLabel: string;
    invalidMessageId: string;
    isVisible: boolean;
}

export const InputAtom = ({validationFn, inputLabel, invalidMessageId, isVisible}: InputProps) => {
    const [inputValue, setInputValue] = useState('');
    const [doCheck, setDoCheck] = useState(false);
    const [searchParams, setSearchParams] = useSearchParams();

    const changeValue = (e: any) => setInputValue(e.target.value);

    useEffect(() => getCollapsable('invalid-input-collapse').hide(), []);

    useEffect(() => {
        if (!doCheck) return;
        if (validationFn(inputValue)) {
            setSearchParams({ trustAnchorUrl: inputValue });
            getCollapsable('invalid-input-collapse').hide();
            getCollapsable('input-collapse').hide();
            cleanInput('input-value');
        }else{
            getCollapsable('invalid-input-collapse').show();
        }
        setDoCheck(false);
    }, [doCheck]);

    useEffect(() => handleCollapseVisibility('input-collapse', isVisible), [isVisible]);

    return (
        <div className="container collapse" id="input-collapse">
            <div className="row">
                <label className="col-2" htmlFor="input-value">{inputLabel}</label>
                <div className="col-9"><input type="text" className="form-control" id="input-value" onChange={changeValue} /></div>
            </div>
            <div className="collapse row" id="invalid-input-collapse">
                <div className="col-12">
                    <div className="alert alert-danger alert-dismissible fade show" role="alert">
                        <FormattedMessage id={invalidMessageId} />
                    </div>
                </div>
            </div>
            <button className="btn btn-primary mt-3" onClick={() => setDoCheck(true)}><FormattedMessage id="trust_anchor_url_button" /></button>
        </div>
    );
}