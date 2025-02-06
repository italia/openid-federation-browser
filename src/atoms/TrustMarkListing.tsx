import React from "react";
import { IconAtom } from "./Icon";
import { useState } from "react";
import { FormattedMessage } from "react-intl";
import axios, { AxiosError } from "axios";
import { PaginatedListAtom } from "./PaginatedList";
import style from "../css/ContextMenu.module.css";

export interface TrustMarkListingProps {
  id: string;
  trustMarkListUrl: string;
  showModalError: (details?: string[]) => void;
}

export const TrustMarkListing = ({
  id,
  trustMarkListUrl,
  showModalError,
}: TrustMarkListingProps) => {
  const [sub, setSub] = useState("");
  const [trustMarkID, setTrustMarkID] = useState("");
  const [trustMarkedList, setTrustMarkedList] = useState<string[]>([]);

  const ItemsRenderer = ({ items }: { items: string[] }) => {
    return (
      <table style={{ listStyleType: "none", width: "100%" }}>
        <tbody>
          {items.map((item, index) => (
            <tr key={index}>
              <td>
                <div className={`row justify-content-center`}>{item}</div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  const fetchItems = async () => {
    const params = new URLSearchParams();

    if (sub !== "") {
      params.append("sub", sub);
    }

    if (trustMarkID !== "") {
      params.append("trust_mark_id", trustMarkID);
    }

    try {
      const response = await axios.get(trustMarkListUrl, {
        params,
      });

      setTrustMarkedList(response.data);
    } catch (error) {
      const response = (error as AxiosError).response;

      if (response?.status === 400) {
        const errorData = response?.data as { error_description: string };
        showModalError([errorData.error_description]);
        return;
      }

      showModalError([response?.statusText || "Unknown error"]);
    }
  };

  return (
    <div style={{ padding: "12px" }}>
      <div className="container">
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
              id={`${id}-sub`}
              onChange={(e) => setSub(e.target.value)}
              placeholder={"Subordinate"}
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
              disabled={trustMarkID === ""}
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

          <div className="row mt-2">
            <div className="col-11">
              <PaginatedListAtom
                items={trustMarkedList}
                itemsPerPage={5}
                ItemsRenderer={ItemsRenderer}
                filterFn={undefined}
                onItemsFiltered={undefined}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
