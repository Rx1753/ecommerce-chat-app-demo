import { CustomError } from "./custom-error";

export class BadRequestError extends CustomError {

    constructor(public message: string) {
        super(message);

        Object.setPrototypeOf(this, BadRequestError.prototype);
    }

    statusCode: number = 400;
    serializeErrors() {
        return [{
            message: this.message
        }]
    }
}
function responseSuccess(data? : Iresponse) {
    return {
      success: true,
      page : data?.page,
      total : data?.total,
      message: data?.message || "success",
      data: data?.result,
    };
  }
  function responseFail(data? : Iresponse) {
    return {
      success: false,
      page : data?.page,
      total : data?.total,
      message: data?.message || "Fail",
      data: data?.result,
    };
  }
  export { responseFail, responseSuccess };
  interface Iresponse{
    message? : string,
    result? : any,
    page? : number,
    total? : number}