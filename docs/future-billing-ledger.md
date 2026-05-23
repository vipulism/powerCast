# Future Billing Ledger

Billing and recharge tracking is intentionally planned for a later phase.

## Why later?

The prepaid electricity balance is affected by multiple factors:

- Recharge amount
- Grid unit charges
- DG unit charges
- Fixed charges
- Society maintenance deductions
- Other deductions from the app or society system

Adding billing too early can make the MVP confusing. Phase 1 should first make weather and power usage understandable.

## Future goals

- Manual recharge entry
- Recharge history
- Opening and closing balance
- Monthly statement
- Grid and DG cost split
- Fixed charge tracking
- Maintenance deduction tracking
- Estimated remaining balance
- Telegram commands for recharge and balance

## Example future ledger fields

```text
Date
Entry type
Amount
Grid units
DG units
Grid rate
DG rate
Fixed charge
Maintenance charge
Balance
Notes
```

## Example future Telegram command

```text
/recharge 5000
/summary
/balance
```

## Important note

The billing ledger should be built only after the data model and daily consumption tracking are stable.
