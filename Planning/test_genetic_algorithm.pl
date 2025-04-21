:- begin_tests(genetic_algorithm).

% Load the main file
:- consult('Genetic_algorithm_Mateusz.pl').

% Test initialization of parameters (US 7.3.2)
test(initialize) :-
    retractall(generations(_)),
    retractall(population(_)),
    retractall(prob_crossover(_)),
    retractall(prob_mutation(_)),
    retractall(max_time(_)),
    retractall(num_genes(_)),
    assertz(generations(100)),
    assertz(population(50)),
    assertz(prob_crossover(0.8)),
    assertz(prob_mutation(0.1)),
    assertz(max_time(60)),
    assertz(num_genes(5)),
    generations(100),
    population(50),
    prob_crossover(0.8),
    prob_mutation(0.1),
    max_time(60),
    num_genes(5).

% Test selection of scheduling method (US 7.3.4)
test(select_method_generate_all_and_select_better) :-
    retractall(surgeries(_)),
    retractall(rooms(_)),
    retractall(max_time(_)),
    assertz(surgeries(2)),
    assertz(rooms(2)),
    assertz(max_time(5)),
    select_method(Method),
    assertion(Method == generate_all_and_select_better).

test(select_method_heuristic) :-
    retractall(surgeries(_)),
    retractall(rooms(_)),
    retractall(max_time(_)),
    assertz(surgeries(5)),
    assertz(rooms(5)),
    assertz(max_time(20)),
    select_method(Method),
    assertion(Method == heuristic).

test(select_method_genetic_algorithm) :-
    retractall(surgeries(_)),
    retractall(rooms(_)),
    retractall(max_time(_)),
    assertz(surgeries(10)),
    assertz(rooms(10)),
    assertz(max_time(60)),
    select_method(Method),
    assertion(Method == genetic_algorithm).

% Test generation of initial population (US 7.3.1)
test(generate_population) :-
    retractall(population(_)),
    assertz(population(10)),
    generate_population(Pop),
    length(Pop, 10).

% Test evaluation of population (US 7.3.1)
test(evaluate_population) :-
    retractall(population(_)),
    assertz(population(10)),
    generate_population(Pop),
    evaluate_population(Pop, PopValue),
    length(PopValue, 10).

% Test ordering of population (US 7.3.1)
test(order_population) :-
    retractall(population(_)),
    assertz(population(10)),
    generate_population(Pop),
    evaluate_population(Pop, PopValue),
    order_population(PopValue, PopValueOrd),
    % Check if the population is ordered by score
    maplist(arg(2), PopValueOrd, Scores),
    assertion(is_sorted(Scores)).

is_sorted([]).
is_sorted([_]).
is_sorted([X, Y | Rest]) :-
    X =< Y,
    is_sorted([Y | Rest]).

:- end_tests(genetic_algorithm).

% Run tests
:- run_tests.