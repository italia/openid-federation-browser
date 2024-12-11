export const isValidUrl = (url: string): boolean => {
    try {
        new URL(url);
        return true;
    } catch (err) {
        return false;
    }
};

export const cleanInput = (id: string) => {
    const trustAnchorElm = document.getElementById(id) as HTMLInputElement;
    trustAnchorElm.value = '';
    trustAnchorElm.focus();
};

export const handleCollapseVisibility = (id: string, isVisible: boolean) => {
    const collapsable = document.getElementById(id);

    if(!collapsable) return;

    if(!isVisible) {
        collapsable.classList.remove('show');
        collapsable.classList.add('hide');
    } else {
        collapsable.classList.remove('hide');
        collapsable.classList.add('show');
    }
};

export const handleKeyDwonEvent = (key: string, onEvent: () => void) => {
    const handleKeyDown = (event: any) => {
        if (event.key === key) onEvent();
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
};