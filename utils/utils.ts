type InjectClassNamesParameter = {
    name: string;
    condition?: (() => boolean) | boolean;
  };
  export function injectClassNames(...classNames: InjectClassNamesParameter[]) {
    return classNames
      .filter((data) => {
        if (data.condition === undefined || data.condition === null) return true;
        else if (typeof data.condition === "function") return data.condition();
        else return data.condition;
      })
      .map((data) => data.name)
      .join(" ");
  }
  