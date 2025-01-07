import { FormattedMessage } from "react-intl";

export const NoImmSubAtom = () => {
  return (
    <div className="container">
      <div className="row">
        <div className="col">
          <p style={{ fontSize: "80%" }}>
            <FormattedMessage id="no_immediate_label" />
          </p>
        </div>
      </div>
    </div>
  );
};
