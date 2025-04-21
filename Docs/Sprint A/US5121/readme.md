# US 5121

## 1. Context

As an Admin, I want to edit existing operation types, so that I can update or correct information about the procedure.

## 2. Requirements

- Admins can search for and select an existing operation type to edit.
- Editable fields include operation name, required staff by specialization, and estimated
  duration.
- Changes are reflected in the system immediately for future operation requests.
- Historical data is maintained, but new operation requests will use the updated operation type
  information.

## 3. Analysis

When editing an Operation, it shouldn't edit the current operation but instead create a new one to maintain historical records.


when editing an operation type there is the need to indicate a date when
 that configuration will be put in place. if there are operations of
that type, scheduled after that date, the system should ideally start a
rescheduling

When editing an operation type put a date where the changes will take effect, and operations after that time need to be rescheduled.


https://moodle.isep.ipp.pt/mod/forum/discuss.php?d=31555#p40004

## 4. Design

### 4.1. Realization

### 4.2. Class Diagram

### 4.4. Applied Patterns

### 4.4. Tests

## 5. Implementation

## 6. Integration/Demonstration

N/A

## 7. Observations
