import { Collapse } from 'bootstrap';

export const isValidUrl = (url: string): boolean => {
    try {
        new URL(url);
        return true;
    } catch (err) {
        return false;
    }
};

export const getCollapsable = (id: string) => {
    return new Collapse(
        document.getElementById(id) as HTMLElement,
        { toggle: false }
    );
};

export const cleanInput = (id: string) => {
    const trustAnchorElm = document.getElementById(id) as HTMLInputElement;
    trustAnchorElm.value = '';
    trustAnchorElm.focus();
};

export const toggleCollapse = (id: string) => getCollapsable(id).toggle();

export const handleCollapseVisibility = (id: string, isVisible: boolean) => {
    if(isVisible) getCollapsable(id).show();
    else getCollapsable(id).hide();
}