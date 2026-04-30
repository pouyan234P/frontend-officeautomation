import { Priorityenum } from "./enumletter/Priorityenum";
import { Typeenum } from "./enumletter/Typeenum";
import { actionTypeenum } from "./enumreferral/actionTypeenum";
import { referralStatusenum } from "./enumreferral/referralStatusenum";

export interface ReferralModel {
    id: string;
    parentReferralId: string;
    letterID: number;
    letterSubject: string;
    letterNo: string;
    replayToLetterNo: string;
    type: Typeenum;
    priority: Priorityenum;
    senderPositionID: number;
    senderName: string;
    senderTitle: string;
    receiverPositionID: number;
    receiverName: string;
    receiverTitle: string;
    actionType: actionTypeenum;
    status: referralStatusenum;
    paraph: string;
    timestamp: Date;
    viewDate: Date;
    actionDate: Date;
    deadline: Date;
 }
