import { Confidentialityenum } from "./enumletter/Confidentialityenum";
import { Priorityenum } from "./enumletter/Priorityenum";
import { Typeenum } from "./enumletter/Typeenum";

export interface LetterModel
{
    id: number;
    subject: string;
    abstract: string;
    letterNo: string;
    createdDate: Date;
    priority: Priorityenum;
    confidentiality: Confidentialityenum;
    type: Typeenum;
    bodyHTML: string;
    bodyReplay: string;
    CreatorPositionID: number;
    isDraft: boolean;
    replyToLetterID: number;
}