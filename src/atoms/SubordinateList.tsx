import {useState, useEffect} from 'react';

export interface SubordinateListProps {
    list: string[];
    discoverSubordinate: (entityID: string) => undefined;
};

export const SubordinateListAtom = ({list, discoverSubordinate}: SubordinateListProps) => {
    const [depPages, setDepPages] = useState<string[][]>([[]]);
    const [currentPage, setCurrentPage] = useState(0);
    const [visualizedList, setVisualizedList] = useState<JSX.Element[]>([]);

    const paginate = (array: string[], pageSize: number = 10) => {
        const pages = [];
        while (array.length > 0) {
            pages.push(array.splice(0, pageSize));
        }
        return pages;
    }

    useEffect(() => setDepPages(paginate(list)), []);

    useEffect(() => {
        const visualizedList = depPages[currentPage].map((dep: string) => {
            return (
                <li key={dep} className="it-list-item row">
                    <div className='col-8'>{dep}</div>
                    <div className='col-4'>
                        <a className="btn btn-primary btn-icon btn-full" title="Discovery" aria-label="Discovery" onClick={() => discoverSubordinate(dep)}>
                            <span className="d-none d-lg-block"><small style={{whiteSpace: "nowrap"}}>Discovery</small></span>
                        </a>
                    </div> 
                </li>
            );
        });

        setVisualizedList(visualizedList);
    }, [depPages]);

    return (
        <ul className="it-list" style={{ overflow: 'hidden', overflowY: 'scroll', height: "10%" }}>
            {visualizedList}
        </ul>
    );
};