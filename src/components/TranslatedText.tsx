"use client";


import {useTranslations} from "@/lib/localize";

interface TranslatedTextProps {
    namespace: string;
    keyText: string;
}

export default function TranslatedText({ namespace, keyText }: TranslatedTextProps) {
    const t = useTranslations(namespace);
    return <>{t(keyText)}</>;
}