import ReactGA from "react-ga4";
import { pickBy, isUndefined } from "lodash";

export interface IGA4Parameters {
  event_name: string;
  event_category: string;
  event_label?: string;
  event_value?: string;
}

class GA_CLIENT {
  init() {
    ReactGA.initialize("G-TBMBTTZS1E");
  }

  event(params: IGA4Parameters) {
    if (!ReactGA.isInitialized) return;
    ReactGA.event(
      params.event_name,
      pickBy(params, (v) => !isUndefined(v))
    );
  }
}

export const gaClient = new GA_CLIENT();
