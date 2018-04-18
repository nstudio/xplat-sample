export namespace ModalState {
  export interface IOptions {
    cmpType: any;
    props?: any;
    modalOptions?: any;
  }

  export interface IState {
    /**
     * Whether modal is open or not
     */
    open: boolean;
    /**
     * Component to open
     */
    cmpType?: any;
    /**
     * Title of the modal
     */
    title?: string;
    /**
     * Latest result passed back when the modal closed (if any)
     */
    latestResult?: any;
  }

  export const initialState: IState = {
    open: false
  };
}
