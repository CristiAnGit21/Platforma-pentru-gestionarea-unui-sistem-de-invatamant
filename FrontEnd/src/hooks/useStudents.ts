import { useCallback, useEffect, useState } from "react";
import { AxiosError } from "axios";
import { useApi } from "../providers/AxiosProvider";

export type StudentDto = {
    id: string;
    name: string;
    email: string;
    role?: string;
    status?: string;
};

type UseStudentsResult = {
    data: StudentDto[];
    loading: boolean;
    error: string | null;
    refetch: () => Promise<void>;
};

function toErrorMessage(error: unknown): string {
    if (error instanceof AxiosError) {
        return error.response?.data?.message ?? error.message;
    }

    if (error instanceof Error) {
        return error.message;
    }

    return "Unexpected error while loading students.";
}

export function useStudents(): UseStudentsResult {
    const api = useApi();
    const [data, setData] = useState<StudentDto[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const fetchStudents = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await api.get<StudentDto[]>("/students");
            setData(response.data);
        } catch (err) {
            setError(toErrorMessage(err));
        } finally {
            setLoading(false);
        }
    }, [api]);

    useEffect(() => {
        void fetchStudents();
    }, [fetchStudents]);

    return {
        data,
        loading,
        error,
        refetch: fetchStudents,
    };
}
