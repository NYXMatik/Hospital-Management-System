# US 0651

## 1. Context

As a healthcare staff member, I want to see a 3D representation of the
hospital/clinic floor.

## 2. Requirements

Its description should be imported from a JSON (JavaScript Object Notation) formatted file. The floor must consist of several surgical rooms. Each room must be enclosed by walls and include a door and a surgical table. There should be no representation of the ceiling. If a room is being used at any given time, a 3D model of a human body should be lying on the table. Models can either be created or imported.

## 3. Analysis

For the floor plant we set up a matrix within the json

where

0 - Floor Tile -  blue

1 - wall on top - red

2 - wall on right - green

3 - wall on bottom - light blue

4 - wall on left - purple

5 - door on top - yellow

6 - door on right - grey

7 - door on bottom - pink

8 - door on left - orange

u - table+body - white

f - table

a - SE Corner

b - NE Corner

c - NW Corner

d - SW Corner

## 4. Design

### 4.1. Realization

### 4.2. Class Diagram

### 4.4. Applied Patterns

### 4.4. Tests

## 5. Implementation

## 6. Integration/Demonstration

N/A

## 7. Observations
