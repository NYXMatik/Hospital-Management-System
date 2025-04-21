# US 5123

## 1. Context

As an Admin, I want to remove obsolete or no longer performed operation types,
so that the system stays current with hospital practices.

## 2. Requirements

- Admins can search for and mark operation types as inactive (rather than deleting them) to
  preserve historical records.
- Inactive operation types are no longer available for future scheduling but remain in historical
  data.
- A confirmation prompt is shown before deactivating an operation type.

## 3. Analysis

**User Story 23**:

- **Question**: Should actions like removing an **operation** **type** be accessed only through specific methods?
- **Answer**: Yes, **operation**s like removal or deactivation should be available via specific API methods.

**Changes to operations affect scheduled ones**:

They still happen if they scheduled and the name still has to be unique.

## 4. Design

### 4.1. Realization

### 4.2. Class Diagram

### 4.4. Applied Patterns

### 4.4. Tests

## 5. Implementation

## 6. Integration/Demonstration

N/A

## 7. Observations
