import React, { useEffect, useState } from "react";
import ReactPaginate from "react-paginate";
import style from "../css/ContextMenu.module.css";
import { FormattedMessage } from "react-intl";

export interface PaginatedListAtomProps {
  itemsPerPage: number;
  items: any[];
  onItemsFiltered?: (items: any[]) => void;
  ItemsRenderer: React.ComponentType<{ items: any[] }>;
  filterFn: ((item: any, filterValue: string) => boolean) | undefined;
}

export const PaginatedListAtom = ({
  itemsPerPage,
  items,
  ItemsRenderer,
  filterFn,
  onItemsFiltered,
}: PaginatedListAtomProps) => {
  const [itemOffset, setItemOffset] = useState(0);
  const [searchValue, setSearchValue] = useState("");
  const [currentItems, setCurrentItems] = useState(items);
  const [pageCount, setPageCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);

  const handlePageClick = (event: { selected: number }) => {
    const newOffset = (event.selected * itemsPerPage) % items.length;
    setCurrentPage(event.selected);
    setItemOffset(newOffset);
  };

  const changeSearchValue = (e: any) => setSearchValue(e.target.value);

  useEffect(
    () => {
      const endOffset = itemOffset + itemsPerPage;
      const filteredItems = filterFn
        ? items.filter((item) => filterFn(item, searchValue))
        : items;
      const currentItems = filteredItems.slice(itemOffset, endOffset);
      const pageCount = Math.ceil(filteredItems.length / itemsPerPage);

      setCurrentItems(currentItems);
      setPageCount(pageCount);
      onItemsFiltered && onItemsFiltered(filteredItems);
    },

    // eslint-disable-next-line react-hooks/exhaustive-deps
    [searchValue, itemOffset, items],
  );

  return (
    <div className={`it-list-wrapper container`} style={{ width: "100%" }}>
      {filterFn && (
        <div className="row justify-content-md-start">
          <div className="col-md-12">
            <input
              type="text"
              className={`form-control ${style.contextAccordinText}`}
              id="input-value"
              placeholder="Filter Subordinates By Entity ID"
              onChange={changeSearchValue}
            />
          </div>
        </div>
      )}
      <div className="row justify-content-md-start pt-4">
        <div className="col">
          <ItemsRenderer items={currentItems} />
        </div>
      </div>
      <div className="row justify-content-md-center pt-4">
        <div className="col-md-auto">
          <ReactPaginate
            className={`pagination ${style.contextAccordinText}`}
            containerClassName="pagination"
            pageClassName="small"
            pageLinkClassName={`page-link ${style.contextAccordinText}`}
            breakLabel="..."
            nextLabel="next >"
            onPageChange={handlePageClick}
            pageRangeDisplayed={3}
            pageCount={pageCount}
            previousLabel="< previous"
            renderOnZeroPageCount={null}
          />
        </div>
      </div>
      <div
        className={`row justify-content-md-center ${style.contextAccordinText}`}
      >
        <FormattedMessage id="current_page" />: {currentPage + 1} / {pageCount}
      </div>
    </div>
  );
};
