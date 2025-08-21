export class ApiResponse {
    static getResponse(code, mensaje, data = null) {
        return {
            status : code,
            message : mensaje,
            data    : data
        }
    }
}