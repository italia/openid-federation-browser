import { Modal } from "bootstrap-italia";

export const isValidUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
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
  const handleKeyDown = (event: KeyboardEvent) => {
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

export const isModalShowed = (id: string) => {
  const modal = document.getElementById(id);
  return modal?.classList.contains("show");
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

export const persistSession = async (screenShot: string) => {
  let currentSessionName = sessionStorage.getItem("currentSessionName");

  if (!currentSessionName) {
    const newName = `session-${new Date().toLocaleString()}`;
    sessionStorage.setItem("currentSessionName", newName);
    currentSessionName = newName;
  }

  const croppedImage = await cropImage(screenShot, 60, 40);

  const currentSession = JSON.stringify({
    screenShot: croppedImage,
    graph: sessionStorage.getItem("currentSession") || "",
    date: Math.floor(Date.now() / 1000),
  });

  localStorage.setItem(currentSessionName, currentSession);
};

export const restoreSession = (sessionName: string) => {
  const currentSession = localStorage.getItem(sessionName);
  if (!currentSession) return;

  sessionStorage.setItem("currentSessionName", sessionName);
  sessionStorage.setItem("currentSession", JSON.parse(currentSession)["graph"]);
};

export const getSessionsList = () => {
  return Object.keys(localStorage)
    .filter((key) => key.startsWith("session-"))
    .map((key) => {
      const data = JSON.parse(localStorage.getItem(key) || "");

      return {
        label: key.replace("session-", ""),
        sessionName: key,
        date: data.date,
        screenShot: data.screenShot,
      };
    });
};

export const deleteSession = (sessionName: string) => {
  localStorage.removeItem(sessionName);
};

export const cropImage = (
  image: string,
  percentageX: number,
  percentageY: number,
) => {
  const originalImage = new Image();
  originalImage.src = image;

  const canvas = document.getElementById("canvas") as HTMLCanvasElement;

  const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;

  return new Promise((resolve) => {
    originalImage.addEventListener("load", function () {
      const width = originalImage.width;
      const height = originalImage.height;

      const size = {
        left: (width - (width * percentageX) / 100) / 2,
        top: (height - (height * percentageY) / 100) / 2,
        right: (width + (width * percentageX) / 100) / 2,
        bottom: (height + (height * percentageY) / 100) / 2,
      };

      const newWidth = width - (width * percentageX) / 100;
      const newHeight = height - (height * percentageY) / 100;

      canvas.width = newWidth;
      canvas.height = newHeight;

      ctx.drawImage(
        originalImage,
        size.left,
        size.top,
        size.right,
        size.bottom,
        0,
        0,
        newWidth,
        newHeight,
      );
      return resolve(canvas.toDataURL());
    });
  });
};

export const cleanEntityID = (entityID: string) =>
  entityID.endsWith("/") ? entityID.slice(0, -1) : entityID;

export const timestampToLocaleString = (timestamp: number) =>
  new Date(timestamp * 1000).toLocaleString(navigator.language.split(",")[0]);
