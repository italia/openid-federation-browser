import React, { useEffect, useState } from 'react';
import ReactPaginate from 'react-paginate';
import { FormattedMessage } from 'react-intl';
import styles from '../css/BodyComponent.module.css';


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
  
    const setCurrentItemsBySearch = () => {
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

    useEffect(() => setCurrentItemsBySearch(), [searchValue, itemOffset, items]);
  
    return (
      <div className={`it-list-wrapper container ${styles.bodyElement}`} style={{width: "100rem"}}>
        {
            filterFn &&
            <div className="row justify-content-md-center">
                <div className="col-md-auto">
                    <label htmlFor="input-value"><FormattedMessage id="search_label" /></label>
                </div>
                <div className="col-7">
                    <input type="text" className="form-control" id="input-value" onChange={changeSearchValue} />
                </div>
            </div>
        }
        <div className="row justify-content-md-center pt-4">
            <div className="col-md-auto">
                <ul><ItemsRenderer items={currentItems} /></ul>
            </div>
        </div>
        <div className='row justify-content-md-center pt-4'>
            <div className='col-md-auto'>
                <ReactPaginate
                    className='pagination'
                    containerClassName='pagination'
                    pageClassName='page-item'
                    pageLinkClassName='page-link'
                    breakLabel="..."
                    nextLabel="next >"
                    onPageChange={handlePageClick}
                    pageRangeDisplayed={5}
                    pageCount={pageCount}
                    previousLabel="< previous"
                    renderOnZeroPageCount={null}
                />
            </div>
        </div>
      </div>
    );
  };