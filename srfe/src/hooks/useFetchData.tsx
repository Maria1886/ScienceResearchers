import axios from "axios";
import { useEffect, useState } from "react";
import { HttpMethods } from "../utils/httpMethods";
import { IRequestOptions } from "../utils/interfaces";


function useFetchData<Type>(method: HttpMethods, apiUrl: string, body: Object = {}) {
    const [data, setData] = useState<Type>();
    const [isLoading, setLoading] = useState<boolean>(true);
    const [url, setUrl] = useState<string>(apiUrl);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const requestOptions: IRequestOptions= {
                    method: method, 
                    url: url,
                    data: body
                }

                const response = await axios(requestOptions);

                setData(response.data);
            } catch (error) {
                // skip
            }
            setLoading(false);
        }

        fetchData();
    }, [url])

    return {
        data, 
        isLoading,
        setUrl
    }
}

export default useFetchData;