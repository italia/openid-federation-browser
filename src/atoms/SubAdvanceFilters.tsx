import { IconAtom } from "./Icon";
import { useState } from "react";
import { FormattedMessage } from "react-intl";
import axios from "axios";
import style from "../css/ContextMenu.module.css";

export interface SubAdvanceFilterProps {
  id: string;
  subordinateUrl: string;
  originalList: string[];
  onListChange: (list: string[]) => void;
  showModalError: (error: Error, details?: string[]) => void;
}

export const SubAdvanceFiltersAtom = ({
  id,
  subordinateUrl,
  originalList,
  onListChange,
  showModalError,
}: SubAdvanceFilterProps) => {
  const [trustMarked, setTrustMarked] = useState(false);
  const [intermediate, setIntermediate] = useState(false);
  const [entityType, setEntityType] = useState("");
  const [trustMarkID, setTrustMarkID] = useState("");

  const fetchItems = async () => {
    const params = new URLSearchParams();

    if (trustMarked) {
      params.append("trust_marked", "true");
    }

    if (intermediate) {
      params.append("intermediate", "true");
    }

    if (entityType !== "") {
      params.append("entity_type", entityType);
    }

    if (trustMarkID !== "") {
      params.append("trust_mark_id", trustMarkID);
    }

    try {
      const response = await axios.get(subordinateUrl, {
        params,
      });

      onListChange(response.data);
    } catch (error) {
      const response = (error as any).response;

      if(response.status === 400) {
        showModalError(new Error(response.data.error_description));
        return;
      }

      showModalError(error as Error);
    }
  };

  const restoreItems = () => onListChange(originalList);

  return (
    <div style={{ padding: "12px" }}>
      <div className="container">
        <div className="row">
          <div className="col-6">
            <div className={`${style.contextAccordinText}`}>
              <input
                className="form-check-input"
                type="checkbox"
                onChange={(e) => setTrustMarked(e.target.checked)}
                id={`${id}-trustMarked`}
              />
              <label
                className="form-check-label"
                htmlFor={`${id}-trustMarked`}
                style={{ padding: "0 0.75rem" }}
              >
                Trust Marked
              </label>
            </div>
          </div>
          <div className="col-6">
            <div className={`${style.contextAccordinText}`}>
              <input
                className="form-check-input"
                type="checkbox"
                onChange={(e) => setIntermediate(e.target.checked)}
                id={`${id}-intermediate`}
              />
              <label
                className="form-check-label"
                htmlFor={`${id}-intermediate`}
                style={{ padding: "0 0.75rem" }}
              >
                Intermediate
              </label>
            </div>
          </div>
        </div>

        <div className="row mt-1">
          <div className="col-11">
            <input
              type="text"
              className={`form-control ${style.contextAccordinText}`}
              id={`${id}-trustMarkID`}
              onChange={(e) => setTrustMarkID(e.target.value)}
              placeholder={"Trust Mark ID"}
            />
          </div>
        </div>

        <div className="row mt-1">
          <div className="col-11">
            <input
              type="text"
              className={`form-control ${style.contextAccordinText}`}
              id={`${id}-entityType`}
              onChange={(e) => setEntityType(e.target.value)}
              placeholder={"Entity Type"}
            />
          </div>
        </div>

        <div className="row mt-2">
          <div className="col-3">
            <button
              className="btn btn-primary btn-icon btn-xs py-1 px-1"
              title="Search"
              aria-label="Search"
              onClick={() => fetchItems()}
            >
              <IconAtom
                iconID="#it-search"
                className="icon-xs icon-white"
                isRounded={false}
              />
              <span className={style.contextAccordinButton}>
                <FormattedMessage id="search" />
              </span>
            </button>
          </div>
          <div className="col-3">
            <button
              className="btn btn-warning btn-icon btn-xs py-1 px-1"
              title="Discovery"
              aria-label="Discovery"
              onClick={() => restoreItems()}
            >
              <IconAtom
                iconID="#it-restore"
                className="icon-xs icon-white"
                isRounded={false}
              />
              <span className={style.contextAccordinButton}>
                <FormattedMessage id="restore" />
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
