import { Modal } from "bootstrap-italia";

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
  trustAnchorElm.value = "";
  trustAnchorElm.focus();
};

export const handleCollapseVisibility = (id: string, isVisible: boolean) => {
  const collapsable = document.getElementById(id);

  if (!collapsable) return;

  if (!isVisible) {
    collapsable.classList.remove("show");
    collapsable.classList.add("hide");
  } else {
    collapsable.classList.remove("hide");
    collapsable.classList.add("show");
  }
};

export const handleKeyDownEvent = (key: string, onEvent: () => void) => {
  const handleKeyDown = (event: any) => {
    if (event.key === key) onEvent();
  };

  window.addEventListener("keydown", handleKeyDown);

  return () => {
    window.removeEventListener("keydown", handleKeyDown);
  };
};

export const toggleModal = (id: string) => {
  const modal = new Modal(document.getElementById(id) as HTMLElement);
  modal.toggle();
};

export const showModal = (id: string) => {
  const modal = new Modal(document.getElementById(id) as HTMLElement);
  modal.show();
};

export const hideModal = (id: string) => {
  const modal = new Modal(document.getElementById(id) as HTMLElement);
  modal.hide();
};

export const fmtValidity = (valid: boolean, reason: string | undefined) => {
  const value = valid ? "valid" : "invalid";
  return valid ? value : `${value} (${reason})`;
};

export const truncateMiddle = (text: string, maxLength: number) => {
  if (text.length <= maxLength) {
    return text;
  }
  const half = Math.floor(maxLength / 2);
  return text.slice(0, half) + "..." + text.slice(-half);
};

export const downloadJsonFile = (
  data: string,
  filename: string | undefined = undefined,
) => {
  const blob = new Blob([data], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = filename || "currentView.json";

  a.click();
  a.remove();
};

export const persistSession = () => {
  let currentSessionName = sessionStorage.getItem("currentSessionName");

  if (!currentSessionName) {
    const newName = `session-${new Date().toLocaleString()}`;
    sessionStorage.setItem("currentSessionName", newName);
    currentSessionName = newName;
  }

  localStorage.setItem(
    currentSessionName,
    sessionStorage.getItem("currentSession") || "",
  );
};

export const restoreSession = (sessionName: string) => {
  const currentSession = localStorage.getItem(sessionName);
  sessionStorage.setItem("currentSessionName", sessionName);
  sessionStorage.setItem("currentSession", currentSession || "");
};

export const getSessionsList = () => {
  return Object.keys(localStorage)
    .filter((key) => key.startsWith("session-"))
    .map((key) => {
      return { label: key.replace("session-", ""), sessionName: key };
    });
};

export const deleteSession = (sessionName: string) => {
  localStorage.removeItem(sessionName);
};
