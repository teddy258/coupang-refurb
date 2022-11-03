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

type TBooleanReturnFunction = boolean | (() => boolean) | void;
type TGenClassNamesModel = [string, TBooleanReturnFunction?][];
/**
 * @param classNames [className, ?condition]
 * (["button"], ["isActive",true], ["isClicked" , clicked === true])
 *
 * ``` genClassNames(["button"],["isClicked" , click === true]) ```
 * ``` output =>  "button isClicked" ```
 */
export function genClassNames(...classNames: TGenClassNamesModel) {
  return classNames
    .filter(([, condition]) => {
      if (condition === undefined || condition === null) return true;
      else if (typeof condition === "function") return !!condition();
      else return !!condition;
    })
    .map(([name]) => name)
    .join(" ");
}
