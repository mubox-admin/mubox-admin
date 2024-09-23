import { expect, it } from "vitest";
import { arraysEqual, cover, fork, intersection, unique } from "../src/Array";

it("intersection test", () => {
  expect(intersection([1, 2, 3, 2], [2])).toStrictEqual([2]);
});

it("arraysEqual test", () => {
  expect(arraysEqual([1, 2, 3, 2], [2])).toBe(false);
});

it("arraysEqual test 2", () => {
  expect(arraysEqual([1, 3, 2, 2], [1, 2, 3, 2])).toBe(true);
});

it("fork test", () => {
  const gods = [
    {
      name: "Ra",
      power: 100,
    },
    {
      name: "Zeus",
      power: 98,
    },
    {
      name: "Loki",
      power: 72,
    },
    {
      name: "Vishnu",
      power: 100,
    },
  ];

  expect(fork(gods, f => f.power > 90)).toStrictEqual([
    [
      {
        name: "Ra",
        power: 100,
      },
      {
        name: "Zeus",
        power: 98,
      },
      {
        name: "Vishnu",
        power: 100,
      },
    ],
    [
      {
        name: "Loki",
        power: 72,
      },
    ],
  ]);
});

it("cover test", () => {
  const gods = [
    {
      name: "Ra",
      power: 100,
    },
    {
      name: "Zeus",
      power: 98,
    },
  ];
  const newGods = [
    {
      name: "Ra",
      power: 30,
    },
    {
      name: "Loki",
      power: 72,
    },
  ];

  expect(cover(gods, newGods, f => f.name)).toStrictEqual([
    {
      name: "Ra",
      power: 30,
    },
    {
      name: "Zeus",
      power: 98,
    },
  ]);
});

it("unique test", () => {
  const fish = [
    {
      name: "Marlin",
      weight: 105,
      source: "ocean",
    },
    {
      name: "Salmon",
      weight: 22,
      source: "river",
    },
    {
      name: "Salmon",
      weight: 22,
      source: "river",
    },
  ];

  expect(unique(fish, f => f.name)).toStrictEqual([
    {
      name: "Marlin",
      weight: 105,
      source: "ocean",
    },
    {
      name: "Salmon",
      weight: 22,
      source: "river",
    },
  ]);
});
