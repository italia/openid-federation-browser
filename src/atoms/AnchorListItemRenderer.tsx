import { useSearchParams } from "react-router-dom";
import trustChainList from "../assets/trustChainList.json";
import { PaginatedListAtom } from "./PaginatedList";
import { IconAtom } from "./Icon";
import style from "../css/ContextMenu.module.css";

export const AnchorListItemRendererAtom = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const ItemsRenderer = ({ items }: { items: any[] }) => {
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
                      setSearchParams({ graphView: "" });
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

  const trustAnchorFilter = (anchor: any, filterValue: string) =>
    anchor.name.toLowerCase().includes(filterValue.toLowerCase());

  return (
    <PaginatedListAtom
      itemsPerPage={5}
      items={trustChainList}
      ItemsRenderer={ItemsRenderer}
      filterFn={trustAnchorFilter}
    />
  );
};
