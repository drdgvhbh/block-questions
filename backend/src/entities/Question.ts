export class Question {
  constructor(
    public readonly id: string,
    public readonly author: string,
    public readonly title: string,
    public readonly content: string,
  ) {}
}
