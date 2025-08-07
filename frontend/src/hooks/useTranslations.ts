import { useTranslations as useNextIntlTranslations } from 'next-intl';

export function useTranslations(namespace?: string) {
    const t = useNextIntlTranslations(namespace);
    return t;
}

export function useCommonTranslations() {
    return useTranslations('common');
}

export function useNavigationTranslations() {
    return useTranslations('navigation');
}

export function useHomeTranslations() {
    return useTranslations('home');
}

export function useAuthTranslations() {
    return useTranslations('auth');
}

export function useTodosTranslations() {
    return useTranslations('todos');
}

export function useErrorTranslations() {
    return useTranslations('errors');
}

export function useMetaTranslations() {
    return useTranslations('meta');
} 