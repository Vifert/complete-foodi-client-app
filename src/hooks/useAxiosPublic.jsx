import axios from "axios";

const axiosPublic = axios.create({
    baseURL: 'https://complete-foodi-client-server-l9jv.onrender.com'
})

const useAxiosPublic = () => {
    return axiosPublic;
};

export default useAxiosPublic;
