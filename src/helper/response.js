class Response {

    static ok(message = 'Berhasil mendapatkan data', data) {
        return { status: 200, message, data, }
    }

    static oks(pagination, data) {
        return { status: 200, message: "Berhasil mendapatkan data", pagination, data, }
    }

    static invalid(message = 'Permintaan tidak valid') {
        return { status: 400, message }
    }

    static unauthorized(message = 'Permintaan tidak diizinkan') {
        return { status: 401, message }
    }

    static notFound(message = 'Data tidak ditemukan') {
        return { status: 404, message }
    }

    static error() {
        return { status: 500, message: "Terjadi kesalahan sistem" }
    }
}

export default Response