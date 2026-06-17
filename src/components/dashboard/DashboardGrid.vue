<template>
  <div class="flex flex-col lg:flex-row gap-4 lg:gap-5">
    <!-- Left Sidebar -->
    <div class="lg:w-[280px] lg:shrink-0 flex flex-col gap-4">
      <ProfileCard
        :profile="profile"
        :net-worth="netWorth"
      />
      <AccordionFinance
        :sections="accordionSections"
      />
    </div>

    <!-- Main Content -->
    <div class="flex-1 flex flex-col gap-4">
      <WeeklyBudgetBar
        :budget-items="budgetItems"
        :total-terpakai="totalTerpakai"
        :total-budget="totalBudget"
      />
      <SpendingBarChart
        :weekly-data="weeklyData"
      />
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <CashflowRing
          :total-budget="dailyBudget"
          :total-terpakai="dailyTerpakai"
          :sisa-aman="sisaAman"
          :safe-percentage="safePercentage"
        />
        <FinanceCalendar
          :bills="bills"
          :current-month="currentMonth"
          :current-year="currentYear"
          @prev-month="$emit('prev-month')"
          @next-month="$emit('next-month')"
        />
      </div>
    </div>

    <!-- Right Sidebar -->
    <div class="lg:w-[320px] lg:shrink-0">
      <RecentTransactions
        :transaksi="recentTransaksi"
        :goals="goals"
      />
    </div>
  </div>
</template>

<script setup>
import ProfileCard from './ProfileCard.vue'
import AccordionFinance from './AccordionFinance.vue'
import WeeklyBudgetBar from './WeeklyBudgetBar.vue'
import SpendingBarChart from './SpendingBarChart.vue'
import CashflowRing from './CashflowRing.vue'
import FinanceCalendar from './FinanceCalendar.vue'
import RecentTransactions from './RecentTransactions.vue'

defineProps({
  profile: { type: Object, default: null },
  netWorth: { type: Number, default: 0 },
  accordionSections: { type: Array, default: () => [] },
  budgetItems: { type: Array, default: () => [] },
  totalTerpakai: { type: Number, default: 0 },
  totalBudget: { type: Number, default: 0 },
  weeklyData: { type: Array, default: () => [] },
  dailyBudget: { type: Number, default: 0 },
  dailyTerpakai: { type: Number, default: 0 },
  sisaAman: { type: Number, default: 0 },
  safePercentage: { type: Number, default: 0 },
  bills: { type: Array, default: () => [] },
  currentMonth: { type: Number, default: 1 },
  currentYear: { type: Number, default: 2024 },
  recentTransaksi: { type: Array, default: () => [] },
  goals: { type: Array, default: () => [] }
})

defineEmits(['prev-month', 'next-month'])
</script>
