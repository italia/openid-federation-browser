import { FormattedMessage } from 'react-intl';

interface VersionAtomProps {
    version: string;  
}

export const VersionAtom = ({version}: VersionAtomProps) => {
    return (
        <div className="it-socials d-none d-md-flex justify-content-center">
            <span className="d-none d-md-block">
                <FormattedMessage id="version" /> {version}
            </span>
        </div>
    );
}