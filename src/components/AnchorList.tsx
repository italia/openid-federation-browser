import React from "react";
import trustChainList from "../assets/trustChainList.json";
import { PaginatedListAtom } from "../atoms/PaginatedList";
import { IconAtom } from "../atoms/Icon";
import style from "../css/ContextMenu.module.css";
import bodyStyle from "../css/BodyComponent.module.css";
import { useNavigate } from "react-router-dom";

export const AnchorList = () => {
  const navigate = useNavigate();

  const ItemsRenderer = ({ items }: { items: {name: string, url: string}[] }) => {
    return (
      <ul style={{ listStyleType: "none" }}>
        {items &&
          items.map((d) => (
            <li key={d.url}>
              <div className="row justify-content-md-start">
                <div className="col-md-auto">
                  <button
                    className={`btn btn-icon btn-sm py-0 px-1 btn-success`}
                    title="Load"
                    aria-label="Load"
                    onClick={() => {
                      sessionStorage.setItem(
                        "trustAnchorUrl",
                        JSON.stringify({ url: d.url, searchType: "anchor" }),
                      );
                      sessionStorage.removeItem("currentSession");
                      sessionStorage.removeItem("currentSessionName");
                      window.dispatchEvent(new Event("trustAnchorUrl"));
                      navigate("/graphView", { replace: true });
                    }}
                  >
                    <IconAtom
                      iconID="#it-plus"
                      className="icon-xs icon-white"
                      isRounded={false}
                    />
                    <span className={style.contextAccordinButton}>Add</span>
                  </button>
                </div>
                <div className={`col-md-auto ${style.contextAccordinText}`}>
                  {d.name} - {d.url}
                </div>
              </div>
            </li>
          ))}
      </ul>
    );
  };

  const trustAnchorFilter = (anchor: {name: string, url: string}, filterValue: string) =>
    anchor.name.toLowerCase().includes(filterValue.toLowerCase());

  return (
    <div className={bodyStyle.bodyElement}>
      <PaginatedListAtom
        itemsPerPage={5}
        items={trustChainList}
        ItemsRenderer={ItemsRenderer}
        filterFn={trustAnchorFilter}
      />
    </div>
  );
};
