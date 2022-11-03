import { stringify } from "query-string";

export function buildQuery(object: Record<string, unknown>) {
  return stringify(object, { skipNull: true, skipEmptyString: true });
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
