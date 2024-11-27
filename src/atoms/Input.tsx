import { useEffect, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { useSearchParams } from 'react-router-dom';
import { getCollapsable, cleanInput } from '../lib/utils';

interface InputProps {
    validationFn: (value: string) => boolean;
};

export const InputAtom = ({validationFn}: InputProps) => {
    const [inputValue, setInputValue] = useState('');
    const [doCheck, setDoCheck] = useState(false);
    const [searchParams, setSearchParams] = useSearchParams();

    const changeValue = (e: any) => setInputValue(e.target.value);

    useEffect(() => {
        if (!doCheck) return;
        if (validationFn(inputValue)) {
            setSearchParams({ trustAnchorUrl: inputValue });
            getCollapsable('invalid-input-collapse').hide();
            cleanInput('input-value');
        }else{
            getCollapsable('invalid-input-collapse').show();
        }
        setDoCheck(false);
    }, [doCheck]);

    return (
        <div style={{width: "40%", marginTop: "5%"}}>
            <div className='row'>
                <h4><FormattedMessage id="insert_trust_node_url_label" /></h4>
            </div>
            <div className="row">
                <label className="col-2" htmlFor="input-value"><FormattedMessage id="url_input_label" /></label>
                <div className="col-9"><input type="text" className="form-control" id="input-value" onChange={changeValue} /></div>
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