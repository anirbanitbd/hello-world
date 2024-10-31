import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from "rxjs";

export enum stepsStatus {
  notStarted = 'notStarted',
  inProgress = 'inProgress',
  completed = 'completed',
  failed = 'failed'
}

export interface TransactionLoaderSteps {
  stepName: string;
  stepNumber: number;
  stepDescription: StepDescription[];
  stepStatus: stepsStatus;
}

export interface StepDescription {
  name: string;
  stepNumber: number;
  stepStatus: stepsStatus;
}

@Injectable({
  providedIn: 'root'
})
export class LoaderService {
  stepsForEth: TransactionLoaderSteps[] = [
    {
      stepName: 'Initializing Transaction',
      stepNumber: 1,
      stepDescription: [
        {
          name: 'Connecting MetaMask Wallet',
          stepNumber: 1,
          stepStatus: stepsStatus.notStarted
        },
        {
          name: 'Collect Staking amount',
          stepNumber: 2,
          stepStatus: stepsStatus.notStarted
        }, {
          name: 'Validate enough funds in the wallet to cover the transaction',
          stepNumber: 3,
          stepStatus: stepsStatus.notStarted
        }, {
          name: 'Collecting platform fees',
          stepNumber: 4,
          stepStatus: stepsStatus.notStarted
        },
        {
          name: 'Estimating Gas',
          stepNumber: 5,
          stepStatus: stepsStatus.notStarted
        },
        {
          name: 'Calculating total cost',
          stepNumber: 6,
          stepStatus: stepsStatus.notStarted
        }
      ],
      stepStatus: stepsStatus.notStarted
    },
    {
      stepName: 'Preparing Smart Contract',
      stepNumber: 2,
      stepDescription: [
        {
          name: 'User Validating transaction in wallet',
          stepNumber: 1,
          stepStatus: stepsStatus.notStarted
        },
        {
          name: 'Contract Confirmation and Execution',
          stepNumber: 2,
          stepStatus: stepsStatus.notStarted
        }
      ],
      stepStatus: stepsStatus.notStarted

    },
    {
      stepName: 'Creating Community',
      stepNumber: 3,
      stepDescription: [
        {
          name: 'Writing details to backend',
          stepNumber: 1,
          stepStatus: stepsStatus.notStarted
        },
        {
          name: 'Confirming community creation',
          stepNumber: 2,
          stepStatus: stepsStatus.notStarted
        },
        {
          name: 'Congratulations',
          stepNumber: 3,
          stepStatus: stepsStatus.notStarted
        }
      ],
      stepStatus: stepsStatus.notStarted
    }
  ];
  stepsForToken: TransactionLoaderSteps[] =[
    {
      stepName: 'Initializing Transaction',
      stepNumber: 1,
      stepDescription: [
        {
          name: 'Connecting MetaMask Wallet',
          stepNumber: 1,
          stepStatus: stepsStatus.notStarted
        },
        {
          name: 'Collect Staking amount',
          stepNumber: 2,
          stepStatus: stepsStatus.notStarted
        }, {
          name: 'Validate enough funds in the wallet to cover the transaction',
          stepNumber: 3,
          stepStatus: stepsStatus.notStarted
        }, {
          name: 'Collecting platform fees',
          stepNumber: 4,
          stepStatus: stepsStatus.notStarted
        },
        {
          name: 'Estimating Gas',
          stepNumber: 5,
          stepStatus: stepsStatus.notStarted
        },
        {
          name: 'Calculating total cost',
          stepNumber: 6,
          stepStatus: stepsStatus.notStarted
        },
        {
          name: 'Checking allowance',
          stepNumber: 7,
          stepStatus: stepsStatus.notStarted
        },
        {
          name: 'Confirming allowance',
          stepNumber: 8,
          stepStatus: stepsStatus.notStarted
        }
      ],
      stepStatus: stepsStatus.notStarted
    },
    {
      stepName: 'Preparing Smart Contract',
      stepNumber: 2,
      stepDescription: [
        {
          name: 'User Validating transaction in wallet',
          stepNumber: 1,
          stepStatus: stepsStatus.notStarted
        },
        {
          name: 'Contract Confirmation and Execution',
          stepNumber: 2,
          stepStatus: stepsStatus.notStarted
        }
      ],
      stepStatus: stepsStatus.notStarted

    },
    {
      stepName: 'Creating Community',
      stepNumber: 3,
      stepDescription: [
        {
          name: 'Writing details to backend',
          stepNumber: 1,
          stepStatus: stepsStatus.notStarted
        },
        {
          name: 'Confirming community creation',
          stepNumber: 2,
          stepStatus: stepsStatus.notStarted
        },
        {
          name: 'Congratulations',
          stepNumber: 3,
          stepStatus: stepsStatus.notStarted
        }
      ],
      stepStatus: stepsStatus.notStarted
    }
  ];
  isLoaderShow: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  isTransactionLoaderShow: BehaviorSubject<any> = new BehaviorSubject<any>({isActive: false, isEth: false});
  transactionLoaderStepsForEth: BehaviorSubject<TransactionLoaderSteps[]> = new BehaviorSubject<TransactionLoaderSteps[]>(this.stepsForEth);
  transactionLoaderStepsForToken: BehaviorSubject<TransactionLoaderSteps[]> = new BehaviorSubject<TransactionLoaderSteps[]>(this.stepsForToken);

  constructor() {
  }

  showLoader() {
    this.isLoaderShow.next(true);
  }

  hideLoader() {
    this.isLoaderShow.next(false);
  }

  loaderState(): Observable<boolean> {
    return this.isLoaderShow.asObservable();
  }

  showTransactionLoader(type:string) {
    if (type === 'eth') {
      this.isTransactionLoaderShow.next({isActive: true, isEth: true});
    }else{
      this.isTransactionLoaderShow.next({isActive: true, isEth: false});
    }
  }

  hideTransactionLoader() {
    this.isTransactionLoaderShow.next({isActive: false, isEth: true});
    this.transactionLoaderStepsForEth.next(this.stepsForEth);
    this.transactionLoaderStepsForToken.next(this.stepsForToken);
  }

  transactionLoaderState(): Observable<boolean> {
    return this.isTransactionLoaderShow.asObservable();
  }

  transactionLoaderStepsStateForEth(): Observable<TransactionLoaderSteps[]> {
    return this.transactionLoaderStepsForEth.asObservable();
  }
  transactionLoaderStepsStateForToken(): Observable<TransactionLoaderSteps[]> {
    return this.transactionLoaderStepsForToken.asObservable();
  }

  startTransactionStep(stepNumber: number, subStepsNumber: number,type:string) {
    if (type === 'eth') {
      let currentSteps = JSON.parse(JSON.stringify(this.transactionLoaderStepsForEth.getValue()));
      let currentStepIndex = currentSteps.findIndex((step: TransactionLoaderSteps) => step.stepNumber === stepNumber);
      if (currentStepIndex !== -1) {
        let currentSubStepIndex = currentSteps[currentStepIndex].stepDescription.findIndex((subStep: StepDescription) => subStep.stepNumber === subStepsNumber);
        if (currentSubStepIndex !== -1) {
          //all previous steps and substeps are completed
          currentSteps.forEach((step: TransactionLoaderSteps) => {
            if (step.stepNumber < stepNumber) {
              step.stepStatus = stepsStatus.completed;
              step.stepDescription.forEach((subStep: StepDescription) => {
                subStep.stepStatus = stepsStatus.completed;
              })
            }
          })
          //all previous substeps are completed
          currentSteps[currentStepIndex].stepDescription.forEach((subStep: StepDescription) => {
            if (subStep.stepNumber < subStepsNumber) {
              subStep.stepStatus = stepsStatus.completed;
            }
          })
          currentSteps[currentStepIndex].stepStatus = stepsStatus.inProgress;
          currentSteps[currentStepIndex].stepDescription.forEach((subStep: StepDescription) => {
            if (subStep.stepNumber == subStepsNumber) {
              subStep.stepStatus = stepsStatus.inProgress;
            }
          })
          console.log('aaaaaaaaaaaaa', currentSteps);
          this.transactionLoaderStepsForEth.next(currentSteps);
        }
      }
    }else {
      let currentSteps = JSON.parse(JSON.stringify(this.transactionLoaderStepsForToken.getValue()));
      let currentStepIndex = currentSteps.findIndex((step: TransactionLoaderSteps) => step.stepNumber === stepNumber);
      if (currentStepIndex !== -1) {
        let currentSubStepIndex = currentSteps[currentStepIndex].stepDescription.findIndex((subStep: StepDescription) => subStep.stepNumber === subStepsNumber);
        if (currentSubStepIndex !== -1) {
          //all previous steps and substeps are completed
          currentSteps.forEach((step: TransactionLoaderSteps) => {
            if (step.stepNumber < stepNumber) {
              step.stepStatus = stepsStatus.completed;
              step.stepDescription.forEach((subStep: StepDescription) => {
                subStep.stepStatus = stepsStatus.completed;
              })
            }
          })
          //all previous substeps are completed
          currentSteps[currentStepIndex].stepDescription.forEach((subStep: StepDescription) => {
            if (subStep.stepNumber < subStepsNumber) {
              subStep.stepStatus = stepsStatus.completed;
            }
          })
          currentSteps[currentStepIndex].stepStatus = stepsStatus.inProgress;
          currentSteps[currentStepIndex].stepDescription.forEach((subStep: StepDescription) => {
            if (subStep.stepNumber == subStepsNumber) {
              subStep.stepStatus = stepsStatus.inProgress;
            }
          })
          console.log('aaaaaaaaaaaaa', currentSteps);
          this.transactionLoaderStepsForToken.next(currentSteps);
        }
      }
    }

  }

  errorLastInProgressTransactionStep() {
    let currentSteps = JSON.parse(JSON.stringify(this.transactionLoaderStepsForEth.getValue()));
    let currentStepIndex = currentSteps.findIndex((step: TransactionLoaderSteps) => step.stepStatus === stepsStatus.inProgress);
    if (currentStepIndex !== -1) {
      currentSteps[currentStepIndex].stepStatus = stepsStatus.failed;
      currentSteps[currentStepIndex].stepDescription.forEach((subStep: StepDescription) => {
        if (subStep.stepStatus === stepsStatus.inProgress) {
          subStep.stepStatus = stepsStatus.failed;
        }
      })
      console.log('aaaaaaaaaaaaa', currentSteps);
      this.transactionLoaderStepsForEth.next(currentSteps);
    }
  }

  completeAllTransactionSteps(type:string) {
    if (type === 'eth') {
      let currentSteps = JSON.parse(JSON.stringify(this.transactionLoaderStepsForEth.getValue()));
      currentSteps.forEach((step: TransactionLoaderSteps) => {
        step.stepStatus = stepsStatus.completed;
        step.stepDescription.forEach((subStep: StepDescription) => {
          subStep.stepStatus = stepsStatus.completed;
        })
      })
      this.transactionLoaderStepsForEth.next(currentSteps);
    }else {
      let currentSteps = JSON.parse(JSON.stringify(this.transactionLoaderStepsForToken.getValue()));
      currentSteps.forEach((step: TransactionLoaderSteps) => {
        step.stepStatus = stepsStatus.completed;
        step.stepDescription.forEach((subStep: StepDescription) => {
          subStep.stepStatus = stepsStatus.completed;
        })
      })
      this.transactionLoaderStepsForToken.next(currentSteps);
    }
  }
}
