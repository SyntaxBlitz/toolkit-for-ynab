import { Feature } from 'toolkit/extension/features/feature';
import { isCurrentRouteBudgetPage } from 'toolkit/extension/utils/ynab';
import { getEmberView } from 'toolkit/extension/utils/ember';
import { formatCurrency } from 'toolkit/extension/utils/currency';

export class ShowRolloverWithBudget extends Feature {
  injectCSS() { return require('./index.css'); }

  shouldInvoke() {
    return isCurrentRouteBudgetPage();
  }

  invoke() {
    $('.toolkit-budget-rollover').removeClass('.toolkit-budget-rollover');
    $('.toolkit-budget-rollover-amount').remove();

    $('.budget-table-row.is-sub-category').each((_, element) => {
      const { monthlySubCategoryBudgetCalculation, monthlySubCategoryBudget, subCategory } = getEmberView(element.id, 'category');

      if (monthlySubCategoryBudgetCalculation && monthlySubCategoryBudgetCalculation.balancePreviousMonth) {
        const total = monthlySubCategoryBudgetCalculation.balancePreviousMonth + monthlySubCategoryBudget.budgeted;
        $('.budget-table-cell-budgeted', element)
          .addClass('toolkit-budget-rollover')
          .prepend($('<div>', {
            class: 'toolkit-budget-rollover-amount currency',
            title: `Total rollover from last month for ${subCategory.get('name')}. Total is ${formatCurrency(total)}.`,
            text: formatCurrency(monthlySubCategoryBudgetCalculation.balancePreviousMonth) + ' + '
          }));
      }
    });
  }

  onRouteChanged() {
    if (!this.shouldInvoke()) return;
    this.invoke();
  }
}
