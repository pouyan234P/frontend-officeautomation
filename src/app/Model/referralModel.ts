import { Priorityenum } from "./enumletter/Priorityenum";
import { Typeenum } from "./enumletter/Typeenum";
import { actionTypeenum } from "./enumreferral/actionTypeenum";
import { referralStatusenum } from "./enumreferral/referralStatusenum";

export interface ReferralModel {
    id: string;
    letterID: number;
    letterSubject: string;
    letterNo: string;
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
