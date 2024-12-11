import React, { useEffect, useState } from 'react';
import ReactPaginate from 'react-paginate';
import { FormattedMessage } from 'react-intl';

export interface PaginatedListAtomProps {
    itemsPerPage: number;
    items: any[];
    ItemsRenderer: React.ComponentType<{ items: any[] }>;
    filterFn: ((item: any, filterValue: string) => boolean) | undefined;
};

export const PaginatedListAtom = ({ itemsPerPage, items, ItemsRenderer, filterFn }: PaginatedListAtomProps) => {
    const [itemOffset, setItemOffset] = useState(0);
    const [searchValue, setSearchValue] = useState('');
    const [currentItems, setCurrentItems] = useState(items);
    const [pageCount, setPageCount] = useState(0);
  
    const setCurrentItemsBySearch = (searchValue: string, itemOffset: number) => {
        const endOffset = itemOffset + itemsPerPage;
        const filteredItems = filterFn ? items.filter((item) => filterFn(item, searchValue)) : items;
        const currentItems = filteredItems.slice(itemOffset, endOffset);
        const pageCount = Math.ceil(filteredItems.length / itemsPerPage);

        setCurrentItems(currentItems);
        setPageCount(pageCount);
    };
  
    const handlePageClick = (event: { selected: number }) => {
      const newOffset = (event.selected * itemsPerPage) % items.length;
      setItemOffset(newOffset);
    };

    const changeSearchValue = (e: any) => setSearchValue(e.target.value);

    useEffect(() => setCurrentItemsBySearch(searchValue, itemOffset), [searchValue, itemOffset]);
  
    return (
      <div className={`it-list-wrapper container`} style={{width: "auto"}}>
        {
            filterFn &&
            <div className="row justify-content-md-center">
                <div className="col-md-auto">
                    <label htmlFor="input-value" style={{fontSize: "80%"}}><FormattedMessage id="search_label" /></label>
                </div>
                <div className="col-7">
                    <input type="text" className="form-control" id="input-value" onChange={changeSearchValue} />
                </div>
            </div>
        }
        <div className="row justify-content-md-center pt-4">
            <div className="col-md-auto">
                <ItemsRenderer items={currentItems} />
            </div>
        </div>
        <div className='row justify-content-md-center pt-4'>
            <div className='col-md-auto'>
                <ReactPaginate
                    className='pagination small'
                    containerClassName='pagination'
                    pageClassName='small'
                    pageLinkClassName='page-link small'
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
      </div>
    );
  };