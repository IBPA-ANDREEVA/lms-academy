# Approved permission matrix · BASE03-A

Source: [Roles — Permission Matrix](https://docs.google.com/spreadsheets/d/1acwbupYPY0GFTYapcER3Qwr6056dj6EUbgBWqX4Kajw/edit#gid=0).

Read-only snapshot verified on 2026-11-04 through the Google Drive connector:
spreadsheet `1acwbupYPY0GFTYapcER3Qwr6056dj6EUbgBWqX4Kajw`, tab
`Permission Matrix`, sheet ID `0`, range `A1:L100`. The result contains one
header and 90 populated action rows (sheet rows 2–91), all marked `Approved`.
The separate `Original Draft (backup)` tab is not the approved matrix used here.
The linked live sheet remains authoritative; this snapshot is dated evidence,
not a second editable policy source.

All 12 source columns, five account-type selections, condition text, stage labels
and blank cells are preserved below. Resource cells left blank in the source
remain blank; no resource name or ownership condition has been inferred.
“Sheet row” is a locator added only for this documentation.

- `Allow`: permitted.
- `Deny`: forbidden.
- `Conditional`: requires additional authorization checks; it is not an unconditional grant.
- `NAN`: the action does not exist for that account type; it is not a spelling of Deny.

Multiple roles may coexist. No union, deny-precedence or active-role combination
algorithm is approved here. An Allow does not remove authentication, applicable
business-policy or server-enforcement requirements. Blank condition cells do not
supply a missing ownership rule. Administrative account management is manual.

See [PD-014](decisions.md#pd-014--base03-a-authentication-authorization-and-account-lifecycle)
and [identity policy](../architecture/identity-access-policy.md) for authentication,
manual administrator handling, source discrepancies and the explicitly deferred
Resource Ownership & Security Validation handoff. Source `Stage` and `Approved`
cells are retained as evidence; discrepancies with existing release allocations
or unfinished lifecycle policies require reconciliation, not silent scope promotion.

| Sheet row | Category | Resource | Action | Guest | Student | Trainer | Manager | Admin | Access conditions / ownership | Stage | Review status | Notes / open questions |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 2 | Identity & Accounts | User Account | Register | Allow | Allow | Allow | Allow | NAN |  | MVP | Approved |  |
| 3 | Identity & Accounts | User Account | View own account | Allow | Allow | Allow | Allow | NAN | Own authenticated user ID | MVP | Approved |  |
| 4 | Identity & Accounts | User Account | Update own account | Allow | Allow | Allow | Allow | NAN | Own authenticated user ID | MVP | Approved |  |
| 5 | Identity & Accounts | User Account | Block account | Deny | Deny | Deny | Deny | Allow |  | MVP | Approved |  |
| 6 | Identity & Accounts | User Account | Unblock account | Deny | Deny | Deny | Deny | Allow |  | MVP | Approved |  |
| 7 | Identity & Accounts | Profile | View own profile | Allow | Allow | Allow | Allow | NAN | Own authenticated user ID | MVP | Approved |  |
| 8 | Identity & Accounts | Profile | Edit own profile | Allow | Allow | Allow | Allow | NAN | Own authenticated user ID | MVP | Approved |  |
| 9 | Identity & Accounts | Profile | View another profile | Deny | Deny | Deny | Deny | Conditional |  | MVP | Approved |  |
| 10 | Identity & Accounts | Profile | Edit another profile | Deny | Deny | Deny | Deny | Conditional |  | MVP | Approved |  |
| 11 | Identity & Accounts | User Roles | View own roles | Allow | Allow | Allow | Allow | Allow | Own authenticated user ID | MVP | Approved |  |
| 12 | Identity & Accounts | User Roles | Assign role | Deny | Deny | Deny | Deny | Allow | Admin-assigned role; audit change; apply immediately | MVP | Approved |  |
| 13 | Identity & Accounts | User Roles | Revoke role | Deny | Deny | Deny | Deny | Allow | Admin-assigned role; audit change; apply immediately | MVP | Approved |  |
| 14 | Identity & Accounts | Sessions | Sign in | Allow | Allow | Allow | Allow | Allow |  | MVP | Approved |  |
| 15 | Identity & Accounts | Sessions | View own sessions | Allow | Allow | Allow | Allow | Allow | Own authenticated user ID | MVP | Approved |  |
| 16 | Identity & Accounts | Sessions | Sign out | Allow | Allow | Allow | Allow | Allow |  | MVP | Approved |  |
| 17 | Identity & Accounts | Sessions | Revoke other sessions | Allow | Allow | Allow | Allow | Allow |  | MVP | Approved |  |
| 18 | Identity & Accounts | Account Recovery | Request password reset | Allow | Allow | Allow | Allow | NAN | One-time verification/recovery token | MVP | Approved |  |
| 19 | Identity & Accounts | Account Recovery | Complete password reset | Allow | Allow | Allow | Allow | NAN | One-time verification/recovery token | MVP | Approved |  |
| 20 | Identity & Accounts | Account Recovery | Verify email | Allow | Allow | Allow | Allow | NAN | One-time verification/recovery token | MVP | Approved |  |
| 21 | Identity & Accounts | Account Recovery | Change email | Allow | Allow | Allow | Allow | NAN |  | MVP | Approved |  |
| 22 | Identity & Accounts | Account Linking | Claim guest purchase | Allow | Allow | Allow | Allow | Allow | Prove identity; never link solely by matching checkout email | MVP | Approved |  |
| 23 | Identity & Accounts | Account Linking | Link another identity | Allow | Allow | Allow | Allow | Allow |  | MVP | Approved |  |
| 24 | Courses & Learning |  | View published catalog course | Allow | Allow | Allow | Allow | Allow |  | MVP | Approved |  |
| 25 | Courses & Learning |  | Create course | Deny | Deny | Allow | Deny | Allow |  | MVP | Approved |  |
| 26 | Courses & Learning |  | Edit course | Deny | Deny | Allow | Deny | Allow | Explicit trainer↔course assignment; publishing admin controlled | MVP | Approved |  |
| 27 | Courses & Learning |  | Publish or unpublish course | Deny | Deny | Deny | Deny | Allow |  | MVP | Approved |  |
| 28 | Courses & Learning |  | Delete course | Deny | Deny | Deny | Deny | Allow |  | MVP | Approved |  |
| 29 | Courses & Learning |  | View lesson | Deny | Allow | Allow | Deny | Allow | Valid course enrollment and entitlement; obey course state | MVP | Approved |  |
| 30 | Courses & Learning |  | Create lesson | Deny | Deny | Conditional | Deny | Allow | Valid course enrollment and entitlement; obey course state | MVP | Approved |  |
| 31 | Courses & Learning |  | Edit lesson | Deny | Deny | Conditional | Deny | Allow | Valid course enrollment and entitlement; obey course state | MVP | Approved |  |
| 32 | Courses & Learning |  | Reorder lessons | Deny | Deny | Conditional | Deny | Allow | Valid course enrollment and entitlement; obey course state | MVP | Approved |  |
| 33 | Courses & Learning |  | Delete lesson | Deny | Deny | Conditional | Deny | Allow | Valid course enrollment and entitlement; obey course state | MVP | Approved |  |
| 34 | Courses & Learning |  | View protected content | Deny | Conditional | Conditional | Deny | Allow | Valid course enrollment and entitlement; obey course state | MVP | Approved |  |
| 35 | Courses & Learning |  | Upload material | Deny | Deny | Allow | Deny | Allow | Explicit trainer↔course assignment; publishing admin controlled | MVP | Approved |  |
| 36 | Courses & Learning |  | Replace material | Deny | Deny | Allow | Deny | Allow | Explicit trainer↔course assignment; publishing admin controlled | MVP | Approved |  |
| 37 | Courses & Learning |  | Delete material | Deny | Deny | Deny | Deny | Allow |  | MVP | Approved |  |
| 38 | Courses & Learning |  | View own enrollment | Deny | Conditional | Deny | Deny | Allow | Own authenticated user ID | MVP | Approved |  |
| 39 | Courses & Learning |  | View student enrollment | Deny | Deny | Conditional | Conditional | Allow | Assigned trainer ↔ course/student relationship, or explicit owner policy | MVP | Approved |  |
| 40 | Courses & Learning |  | Grant enrollment | Deny | Deny | Deny | Deny | Allow | Audited admin action; verify learner and purchase/exception | MVP | Approved |  |
| 41 | Courses & Learning |  | Revoke enrollment | Deny | Deny | Deny | Deny | Allow | Audited admin action; verify learner and purchase/exception | MVP | Approved |  |
| 42 | Courses & Learning |  | View progress | Deny | Conditional | Conditional | Conditional | Allow | Valid course enrollment and entitlement; obey course state | MVP | Approved |  |
| 43 | Courses & Learning |  | Update own progress | Deny | Conditional | Deny | Deny | Deny | Own authenticated user ID | MVP | Approved |  |
| 44 | Courses & Learning |  | View student progress | Deny | Conditional | Conditional | Deny | Allow | Assigned trainer ↔ course/student relationship, or explicit owner policy | MVP | Approved |  |
| 45 | Courses & Learning |  | View task | Deny | Conditional | Allow | Deny | Deny | Valid course enrollment and entitlement; obey course state | MVP | Approved |  |
| 46 | Courses & Learning |  | Submit assignment | Deny | Conditional | Conditional | Deny | Deny | Valid course enrollment and entitlement; obey course state | MVP | Approved |  |
| 47 | Courses & Learning |  | Resubmit assignment | Deny | Conditional | Conditional | Deny | Deny | Valid course enrollment and entitlement; obey course state | MVP | Approved |  |
| 48 | Courses & Learning |  | Review submission | Deny | Deny | Conditional | Deny | Deny | Assigned trainer ↔ course/student relationship, or explicit owner policy | MVP | Approved |  |
| 49 | Courses & Learning |  | Accept submission | Deny | Deny | Conditional | Deny | Deny | Assigned trainer ↔ course/student relationship, or explicit owner policy | MVP | Approved |  |
| 50 | Courses & Learning |  | Request revision | Deny | Deny | Conditional | Deny | Deny | Assigned trainer ↔ course/student relationship, or explicit owner policy | MVP | Approved |  |
| 51 | Courses & Learning |  | Upload own file | Deny | Conditional | Conditional | Deny | Deny | Own authenticated user ID | MVP | Approved |  |
| 52 | Courses & Learning |  | View or download submission | Deny | Conditional | Conditional | Deny | Deny | Assigned trainer ↔ course/student relationship, or explicit owner policy | MVP | Approved |  |
| 53 | Courses & Learning |  | Delete submitted file | Deny | Conditional | Conditional | Deny | Deny |  | MVP | Approved |  |
| 54 | Courses & Learning |  | Read conversation | Deny | Conditional | Conditional | Conditional | Deny | Assigned trainer ↔ course/student relationship, or explicit owner policy | MVP | Approved |  |
| 55 | Courses & Learning |  | Send message | Deny | Conditional | Conditional | Conditional | Deny | Assigned trainer ↔ course/student relationship, or explicit owner policy | MVP | Approved |  |
| 56 | Courses & Learning |  | View or download own certificate | Deny | Allow | Conditional | Deny | Allow | Own authenticated user ID | MVP | Approved |  |
| 57 | Courses & Learning |  | Issue certificate | Deny | Deny | Deny | Deny | Allow |  | MVP | Approved |  |
| 58 | Courses & Learning |  | Revoke certificate | Deny | Deny | Deny | Deny | Allow |  | MVP | Approved |  |
| 59 | Commerce & Finance |  | View published product | Allow | Allow | Allow | Allow | Allow |  | MVP | Approved |  |
| 60 | Commerce & Finance |  | Create product | Deny | Deny | Deny | Deny | Allow |  | MVP | Approved |  |
| 61 | Commerce & Finance |  | Edit pricing | Deny | Deny | Deny | Deny | Allow |  | MVP | Approved |  |
| 62 | Commerce & Finance |  | Publish product | Deny | Deny | Deny | Deny | Allow |  | MVP | Approved |  |
| 63 | Commerce & Finance |  | Manage cart | Allow | Allow | Conditional | Conditional | Conditional |  | MVP | Approved |  |
| 64 | Commerce & Finance |  | Start checkout | Allow | Allow | Conditional | Conditional | Conditional |  | MVP | Approved |  |
| 65 | Commerce & Finance |  | Complete checkout | Allow | Allow | Conditional | Conditional | Conditional |  | MVP | Approved |  |
| 66 | Commerce & Finance |  | View own order | Allow | Allow | Conditional | Conditional | Conditional | Own authenticated user ID | MVP | Approved |  |
| 67 | Commerce & Finance |  | View other orders | Deny | Deny | Deny | Deny | Allow |  | MVP | Approved |  |
| 68 | Commerce & Finance |  | Refund order | Deny | Deny | Deny | Deny | Allow | Audited admin refund; revoke affected access | MVP | Approved |  |
| 69 | Commerce & Finance |  | View own receipt | Allow | Allow | Conditional | Conditional | Conditional | Own authenticated user ID | MVP | Approved |  |
| 70 | Commerce & Finance |  | View payment record | Deny | Deny | Deny | Deny | Allow |  | MVP | Approved |  |
| 71 | Commerce & Finance |  | View own earnings | Deny | Deny | Allow | Allow | Allow | Own authenticated user ID | Stage 2 | Approved |  |
| 72 | Commerce & Finance |  | Calculate earnings | Deny | Deny | Allow | Allow | Allow |  | Stage 2 | Approved |  |
| 73 | Commerce & Finance |  | Approve payout | Deny | Deny | Deny | Deny | Allow |  | Stage 2 | Approved |  |
| 74 | Commerce & Finance |  | View own commission | Deny | Deny | Conditional | Conditional | Allow | Own authenticated user ID | Stage 2 | Approved |  |
| 75 | Commerce & Finance |  | Calculate commission | Deny | Deny | Deny | Deny | Allow |  | Stage 2 | Approved |  |
| 76 | Commerce & Finance |  | Approve commission | Deny | Deny | Deny | Deny | Allow |  | Stage 2 | Approved |  |
| 77 | Commerce & Finance |  | Create promo code | Deny | Deny | Deny | Deny | Allow |  | Stage 2 | Approved |  |
| 78 | Commerce & Finance |  | Edit promo code | Deny | Deny | Deny | Deny | Allow |  | Stage 2 | Approved |  |
| 79 | Commerce & Finance |  | Disable promo code | Deny | Deny | Deny | Deny | Allow |  | Stage 2 | Approved |  |
| 80 | Administration & System |  | View assigned courses | Deny | Deny | Conditional | Deny | Allow | Explicit trainer↔course assignment; publishing admin controlled | MVP | Approved |  |
| 81 | Administration & System |  | Assign trainer to course | Deny | Deny | Deny | Deny | Allow | Explicit trainer↔course assignment; publishing admin controlled | MVP | Approved |  |
| 82 | Administration & System |  | Remove trainer from course | Deny | Deny | Conditional | Deny | Allow |  | MVP | Approved |  |
| 83 | Administration & System |  | Edit deadlines | Deny | Deny | Conditional | Deny | Allow |  | MVP | Approved |  |
| 84 | Administration & System |  | Edit access periods | Deny | Deny | Conditional | Deny | Allow |  | MVP | Approved |  |
| 85 | Administration & System | Notifications | View own notifications | NAN | Allow | Allow | Allow | Allow | Own authenticated user ID | MVP | Approved |  |
| 86 | Administration & System | Notifications | Send notification | Deny | Deny | Conditional | Deny | Allow |  | MVP | Approved |  |
| 87 | Administration & System | Reports & Analytics | View reports | Deny | Deny | Deny | Deny | Allow |  | Stage 2 | Approved |  |
| 88 | Administration & System | Reports & Analytics | Export reports | Deny | Deny | Deny | Deny | Allow |  | Stage 2 | Approved |  |
| 89 | Administration & System | Audit Logs | View admin audit log | Deny | Deny | Deny | Deny | Allow |  | MVP | Approved |  |
| 90 | Administration & System | System Settings | View settings | Deny | Deny | Deny | Deny | Allow |  | MVP | Approved |  |
| 91 | Administration & System | System Settings | Update settings | Deny | Deny | Deny | Deny | Allow |  | MVP | Approved |  |

